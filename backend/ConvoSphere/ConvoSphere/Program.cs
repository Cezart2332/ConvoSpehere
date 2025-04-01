using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using BCrypt.Net;

using ConvoSphere;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll"); 
app.UseAuthorization();

app.MapControllers(); 

app.Run();

namespace ConvoSphere
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        [HttpPost]
        public IActionResult Register([FromBody] RegisterData registerData)
        {
            MySqlConnection conn = Connection.GetConn();
            conn.Open();
            
            string query = "SELECT email,username FROM users";
            MySqlCommand cmd = new MySqlCommand(query, conn);
            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    string email = reader["email"].ToString();
                    string username = reader["username"].ToString();
                    if (email.Equals(registerData.email))
                    {
                        throw new Exception("Email already in use");
                    }
                    if (username.Equals(registerData.username))
                    {
                        throw new Exception("Username already in use");
                    }
                }
            }
            string query1 = "INSERT INTO users (username,email, password) VALUES (@username,@email, @password)";
            MySqlCommand cmd1 = new MySqlCommand(query1, conn);
            cmd1.Parameters.AddWithValue("@username", registerData.username.Trim());
            cmd1.Parameters.AddWithValue("@email", registerData.email.Trim());
            cmd1.Parameters.AddWithValue("@password", BCrypt.Net.BCrypt.HashPassword(registerData.password, 13));
            int l = cmd1.ExecuteNonQuery();
            conn.Close();
            return Ok(registerData);
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody]LoginData loginData)
        {
            MySqlConnection conn = Connection.GetConn();
            conn.Open();
            RegisterData registerData;
            
            string query = "SELECT * FROM users where email = @email";
            MySqlCommand cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@email", loginData.email.Trim());
            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                if (reader.Read())
                {
                    if (!BCrypt.Net.BCrypt.Verify(loginData.password, reader["password"].ToString()))
                    {
                        return Unauthorized("Incorrect password");
                    }
                    else
                    {
                        string username = reader["username"].ToString();
                        string email = reader["email"].ToString();
                        string password = reader["password"].ToString();
                        registerData = new RegisterData(username, email, password);
                    }

                }
                else
                {
                    throw new Exception("Email is incorrect");
                }
            }

            return Ok(registerData);
        }
        [HttpGet("getprofiledata")]
        public IActionResult getProfileData([FromQuery] string username)
        {
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                string q1 = "SELECT id,firstName,lastName, followers, following, profilephoto, description FROM users WHERE username = @username";
                MySqlCommand cmd1 = new MySqlCommand(q1, conn);
                cmd1.Parameters.AddWithValue("@username", username);
        
                using (MySqlDataReader reader = cmd1.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        string profilePhoto = "";
                        string firstName = "";
                        string lastName = "";
                        string description = "";
                        if (!reader.IsDBNull(reader.GetOrdinal("firstName"))) firstName = reader.GetString("firstName");
                       
                        if (!reader.IsDBNull(reader.GetOrdinal("lastName")))lastName = reader.GetString("lastName");
                        
                        int followers = reader.GetInt32("followers");
                        int following = reader.GetInt32("following");
                        if (!reader.IsDBNull(reader.GetOrdinal("profilephoto")))
                        {
                            byte[] byteImage = (byte[])reader["profilephoto"];
                            profilePhoto = Convert.ToBase64String(byteImage);
                        }
                        if (!reader.IsDBNull(reader.GetOrdinal("description")))description = reader.GetString("description");
                        userData user = new userData(username,firstName,lastName, followers, following, profilePhoto, description);
                        return Ok(user);
                    }
                }
                conn.Close();
            }
            
            return Unauthorized();
        }

        [HttpPost("editprofiledata")]
        public IActionResult editData([FromBody] EditData editData)
        {
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                string query = "UPDATE users SET firstName = @firstName, lastName = @lastName, profilephoto = @profilephoto, description = @description WHERE username = @username";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@username", editData.username);
                cmd.Parameters.AddWithValue("@firstName", editData.firstName);
                cmd.Parameters.AddWithValue("@lastName", editData.lastName);
                string base64Image = editData.profilePhoto;
                var base64Parts = base64Image.Split(',');
                string actualBase64 = base64Parts.Length > 1 ? base64Parts[1] : base64Parts[0];
                byte[] image = Convert.FromBase64String(actualBase64);
                cmd.Parameters.AddWithValue("@profilephoto", image);
                cmd.Parameters.AddWithValue("@description", editData.description);
                int l = cmd.ExecuteNonQuery();
                conn.Close();
                return Ok(505);
            }
        }

        [HttpPost("follow")]
        public IActionResult follow([FromBody] Follow follow)
        {
            int id1 = 0;
            int id2 = 0;
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                string q1 = "SELECT id FROM users WHERE username = @username";
                MySqlCommand cmd1 = new MySqlCommand(q1, conn);
                cmd1.Parameters.AddWithValue("@username", follow.username);
                using (MySqlDataReader reader = cmd1.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        id1 = reader.GetInt32("id");
                    }
                }
                string q2 = "SELECT id FROM users WHERE username = @toFollow";
                MySqlCommand cmd2 = new MySqlCommand(q2, conn);
                cmd2.Parameters.AddWithValue("@toFollow", follow.toFollow);
                using (MySqlDataReader reader = cmd2.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        id2 = reader.GetInt32("id");
                    }
                }

                if (id1 == 0 || id2 == 0)
                {
                    return Unauthorized();
                }
                string q3 = "INSERT INTO follows(follower_id, following_id) VALUES (@follower_id, @following_id)";
                MySqlCommand cmd3 = new MySqlCommand(q3, conn);
                cmd3.Parameters.AddWithValue("@follower_id", id1);
                cmd3.Parameters.AddWithValue("@following_id", id2);
                int l = cmd3.ExecuteNonQuery();
                string q4 = "UPDATE users SET following = following + 1 WHERE username = @username";
                string q5 = "UPDATE users SET followers = followers + 1 WHERE username = @toFollow";
                MySqlCommand cmd4 = new MySqlCommand(q4, conn);
                cmd4.Parameters.AddWithValue("@username", follow.username);
                MySqlCommand cmd5 = new MySqlCommand(q5, conn);
                cmd5.Parameters.AddWithValue("@toFollow", follow.toFollow);
                l = cmd5.ExecuteNonQuery();
                l = cmd4.ExecuteNonQuery();
                conn.Close();
                return Ok(200);
            }
        }
        [HttpPost("unfollow")]
        public IActionResult unfollow([FromBody] Follow follow)
        {
            int id1 = 0;
            int id2 = 0;
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                string q1 = "SELECT id FROM users WHERE username = @username";
                MySqlCommand cmd1 = new MySqlCommand(q1, conn);
                cmd1.Parameters.AddWithValue("@username", follow.username);
                using (MySqlDataReader reader = cmd1.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        id1 = reader.GetInt32("id");
                    }
                }
                string q2 = "SELECT id FROM users WHERE username = @toFollow";
                MySqlCommand cmd2 = new MySqlCommand(q2, conn);
                cmd2.Parameters.AddWithValue("@toFollow", follow.toFollow);
                using (MySqlDataReader reader = cmd2.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        id2 = reader.GetInt32("id");
                    }
                }

                if (id1 == 0 || id2 == 0)
                {
                    return Unauthorized();
                }
                string q3 = "DELETE FROM follows WHERE follower_id = @follower_id AND following_id = @following_id;";
                MySqlCommand cmd3 = new MySqlCommand(q3, conn);
                cmd3.Parameters.AddWithValue("@follower_id", id1);
                cmd3.Parameters.AddWithValue("@following_id", id2);
                int l = cmd3.ExecuteNonQuery();
                string q4 = "UPDATE users SET following = following - 1 WHERE username = @username";
                string q5 = "UPDATE users SET followers = followers - 1 WHERE username = @toFollow";
                MySqlCommand cmd4 = new MySqlCommand(q4, conn);
                cmd4.Parameters.AddWithValue("@username", follow.username);
                MySqlCommand cmd5 = new MySqlCommand(q5, conn);
                cmd5.Parameters.AddWithValue("@toFollow", follow.toFollow);
                l = cmd5.ExecuteNonQuery();
                l = cmd4.ExecuteNonQuery();
                conn.Close();
                return Ok(200);
            }
        }
        [HttpPost("isfollowing")]
        public IActionResult IsFollowing([FromBody] Follow follow)
        {
            int id1 = 0;
            int id2 = 0;

            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                
                string q1 = "SELECT id FROM users WHERE username = @username";
                MySqlCommand cmd1 = new MySqlCommand(q1, conn);
                cmd1.Parameters.AddWithValue("@username", follow.username);
                using (MySqlDataReader reader = cmd1.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        id1 = reader.GetInt32("id");
                    }
                }
                
                string q2 = "SELECT id FROM users WHERE username = @toFollow";
                MySqlCommand cmd2 = new MySqlCommand(q2, conn);
                cmd2.Parameters.AddWithValue("@toFollow", follow.toFollow);
                using (MySqlDataReader reader = cmd2.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        id2 = reader.GetInt32("id");
                    }
                }
                
                if (id1 == 0 || id2 == 0)
                {
                    return Unauthorized();
                }
                
                string q3 = "SELECT COUNT(*) FROM follows WHERE follower_id = @follower_id AND following_id = @following_id";
                MySqlCommand cmd3 = new MySqlCommand(q3, conn);
                cmd3.Parameters.AddWithValue("@follower_id", id1);
                cmd3.Parameters.AddWithValue("@following_id", id2);

                int count = Convert.ToInt32(cmd3.ExecuteScalar());

                conn.Close();
                
                return Ok(new { isFollowing = count > 0 });
            }
        }
        [HttpGet("search")]
        public IActionResult getSearchUsers([FromQuery] string input)
        {
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                string query = "SELECT * FROM users WHERE username  Like @input";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@input", input.Trim() + "%");
                var users = new List<object>();
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string firstName = "";
                        string lastName = "";
                        int id = reader.GetInt32("id");
                        string username = reader.GetString("username");
                        if(!reader.IsDBNull(reader.GetOrdinal("firstName"))) firstName = reader.GetString("firstName");
                        if(!reader.IsDBNull(reader.GetOrdinal("lastName"))) lastName = reader.GetString("lastName");
                        string profilePhoto = "";
                        if (!reader.IsDBNull(reader.GetOrdinal("profilephoto")))
                        {
                            byte[] byteImage = (byte[])reader["profilephoto"];
                            profilePhoto = Convert.ToBase64String(byteImage);
                        }
                        users.Add(new {id, username, firstName, lastName, profilePhoto });
                    }
                }
                return Ok(users);
            }
        }
    }

    [Route("api/posts")]
    public class PostsController : ControllerBase
    {
        [HttpPost("upload")]
        public IActionResult Post([FromBody] PostData postData)
        {
            if (postData == null)
            {
                return BadRequest("Post data is null");
            }

            if (string.IsNullOrEmpty(postData.image))
            {
                return BadRequest("Image data is missing.");
            }

            int userId = 0;
            MySqlConnection conn = Connection.GetConn();
            conn.Open();
            string base64Image = postData.image;
            var base64Parts = base64Image.Split(',');
            string actualBase64 = base64Parts.Length > 1 ? base64Parts[1] : base64Parts[0];
            byte[] image = Convert.FromBase64String(actualBase64);
            string q1 = "SELECT id FROM users WHERE email = @email";
            MySqlCommand cmd1 = new MySqlCommand(q1, conn);
            cmd1.Parameters.AddWithValue("@email", postData.email.Trim());
            using (MySqlDataReader reader = cmd1.ExecuteReader())
            {
                if (reader.Read())
                {
                    userId = reader.GetInt32("id");
                }
            }

            string q2 = "INSERT INTO posts(user_id,image,description) VALUES (@user_id,@image,@description)";
            MySqlCommand cmd2 = new MySqlCommand(q2, conn);
            cmd2.Parameters.AddWithValue("@user_id", userId);
            cmd2.Parameters.AddWithValue("@image", image);
            cmd2.Parameters.AddWithValue("@description", postData.description);
            int l = cmd2.ExecuteNonQuery();
            conn.Close();
            return Ok(505);
        }

        [HttpPost("getposts")]
        public IActionResult getUserPosts([FromBody] string username)
        {
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                int userID = 0;
                List<Post> posts = new List<Post>();
                string q1 = "SELECT id FROM users WHERE username = @username";
                MySqlCommand cmd1 = new MySqlCommand(q1, conn);
                cmd1.Parameters.AddWithValue("@username", username.Trim());
                using (MySqlDataReader reader = cmd1.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        userID = reader.GetInt32("id");
                    }
                }

                string q2 = "SELECT * FROM posts WHERE user_id = @user_id";
                MySqlCommand cmd2 = new MySqlCommand(q2, conn);
                cmd2.Parameters.AddWithValue("@user_id", userID);
                using (MySqlDataReader reader = cmd2.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int id = reader.GetInt32("id");
                        byte[] byteImage = (byte[])reader["image"];
                        string image = Convert.ToBase64String(byteImage);
                        string description = reader["description"].ToString();
                        int likes = reader.GetInt32("likes");
                        int comments = reader.GetInt32("comments");
                        Post p = new Post(id, username, description, image, likes, comments);
                        posts.Add(p);
                    }
                }

                return Ok(posts);
            }
        }

        [HttpGet("feed")]
        public IActionResult GetFeed([FromQuery] string username)
        {
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                int userId = 0;
                List<int> following = new List<int>();
                List<Post> feed = new List<Post>();
                string q1 = "SELECT id from users WHERE username = @username";
                MySqlCommand cmd1 = new MySqlCommand(q1, conn);
                cmd1.Parameters.AddWithValue("@username", username.Trim());
                using (MySqlDataReader reader = cmd1.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        userId = reader.GetInt32("id");
                    }
                }
                string q2 = "SELECT * FROM posts WHERE user_id = @user_id";
                MySqlCommand cmd2 = new MySqlCommand(q2, conn);
                cmd2.Parameters.AddWithValue("@user_id", userId);
                using (MySqlDataReader reader = cmd2.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int id = reader.GetInt32("id");
                        byte[] byteImage = (byte[])reader["image"];
                        string image = Convert.ToBase64String(byteImage);
                        string description = reader["description"].ToString();
                        int likes = reader.GetInt32("likes");
                        int comments = reader.GetInt32("comments");
                        Post p = new Post(id, username, description, image, likes, comments);
                        feed.Add(p);
                    }
                }
                string q3 = "SELECT following_id FROM follows WHERE follower_id = @follower_id";
                MySqlCommand cmd3 = new MySqlCommand(q3, conn);
                cmd3.Parameters.AddWithValue("@follower_id", userId);
                using (MySqlDataReader reader = cmd3.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int followingId = reader.GetInt32("following_id");
                        following.Add(followingId);
                    }
                }

                foreach (int f in following)
                {
                    string postUsername = "";
                    string q4 = "SELECT username FROM users WHERE id = @id";
                    MySqlCommand cmd4 = new MySqlCommand(q4, conn);
                    cmd4.Parameters.AddWithValue("@id", f);
                    using (MySqlDataReader reader = cmd4.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            postUsername = reader.GetString("username");
                        }
                    }
                    string q5 = "SELECT * FROM posts WHERE user_id = @user_id";
                    MySqlCommand cmd5 = new MySqlCommand(q5, conn);
                    cmd5.Parameters.AddWithValue("@user_id", f);
                    using (MySqlDataReader reader = cmd5.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            int id = reader.GetInt32("id");
                            byte[] byteImage = (byte[])reader["image"];
                            string image = Convert.ToBase64String(byteImage);
                            string description = reader["description"].ToString();
                            int likes = reader.GetInt32("likes");
                            int comments = reader.GetInt32("comments");
                            Post p = new Post(id,postUsername, description, image, likes, comments);
                            feed.Add(p);
                        }
                    }
                }
                return Ok(feed);
            }
        }
        [HttpGet("liked")]
        public IActionResult getLiked([FromQuery] string username)
        {
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                int userId = 0;
                var likes = new List<object>();
                string q1 = "SELECT id from users WHERE username = @username";
                MySqlCommand cmd1 = new MySqlCommand(q1, conn);
                cmd1.Parameters.AddWithValue("@username", username.Trim());
                using (MySqlDataReader reader = cmd1.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        userId = reader.GetInt32("id");
                    }
                }
                string q2 = "SELECT * FROM liked WHERE user_id = @user_id";
                MySqlCommand cmd2 = new MySqlCommand(q2, conn);
                cmd2.Parameters.AddWithValue("@user_id", userId);
                using (MySqlDataReader reader = cmd2.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int postID = reader.GetInt32("post_id");
                        likes.Add(new
                        {
                            id = postID,
                        });
                    }
                }
                return Ok(likes);
            }
        }

        [HttpPost("unlike")]
        public IActionResult unlike([FromBody] LikePost likePost)
        {
            int id = likePost.id;
            string username = likePost.username;
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                string q = "UPDATE posts SET likes = likes - 1 WHERE id = @post_id";
                MySqlCommand cmd = new MySqlCommand(q, conn);
                cmd.Parameters.AddWithValue("@post_id", id);
                int l = cmd.ExecuteNonQuery();
                string q2 = "SELECT id FROM users WHERE username = @username";
                MySqlCommand cmd2 = new MySqlCommand(q2, conn);
                cmd2.Parameters.AddWithValue("@username", username);
                int userId = 0;
                using (MySqlDataReader reader = cmd2.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        userId = reader.GetInt32("id");
                    }
                }
                string q3 = "DELETE FROM liked WHERE user_id = @user_id AND post_id = @post_id";
                MySqlCommand cmd3 = new MySqlCommand(q3, conn);
                cmd3.Parameters.AddWithValue("@user_id", userId);
                cmd3.Parameters.AddWithValue("@post_id", id);
                int l1 = cmd3.ExecuteNonQuery();
                return Ok(200);
            }
        }
        [HttpPost("like")]
        public IActionResult like([FromBody] LikePost likePost)
        {
            int id = likePost.id;
            string username = likePost.username;
            using (MySqlConnection conn = Connection.GetConn())
            {
                conn.Open();
                string q = "UPDATE posts SET likes = likes + 1 WHERE id = @post_id";
                MySqlCommand cmd = new MySqlCommand(q, conn);
                cmd.Parameters.AddWithValue("@post_id", id);
                int l = cmd.ExecuteNonQuery();
                string q2 = "SELECT id FROM users WHERE username = @username";
                MySqlCommand cmd2 = new MySqlCommand(q2, conn);
                cmd2.Parameters.AddWithValue("@username", username);
                int userId = 0;
                using (MySqlDataReader reader = cmd2.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        userId = reader.GetInt32("id");
                    }
                }
                string q3 = "INSERT INTO liked (user_id, post_id) VALUES (@user_id, @post_id)";
                MySqlCommand cmd3 = new MySqlCommand(q3, conn);
                cmd3.Parameters.AddWithValue("@user_id", userId);
                cmd3.Parameters.AddWithValue("@post_id", id);
                int l1 = cmd3.ExecuteNonQuery();
                return Ok(200);
            }
        }
}

    public class RegisterData
    {
        public string username { get; set; }
        public string email { get; set; }
        
        public string password { get; set; }

        public RegisterData(string username, string email, string password)
        {
            this.username = username;
            this.email = email;
            this.password = password;
        }

        public RegisterData()
        {
            this.username = "";
            this.email = "";
            this.password = "";
        }
    }
    public class LoginData
    {
        public string email { get; set; }
        
        public string password { get; set; }

        public LoginData(string email, string password)
        {
            this.email = email;
            this.password = password;
        }
    }

    public class PostData
    {
        public string email { get; set; }
        public string image { get; set; }
        public string description { get; set; }
    }

    public class userData
    {
        public string username { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public int followers { get; set; }
        public int following { get; set; }
        public string profilePhoto { get; set; }
        public string description { get; set; }

        public userData(string username,string firstName,string lastName, int followers, int following, string profilePhoto,string description)
        {
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            this.followers = followers;
            this.following = following;
            this.profilePhoto = profilePhoto;
            this.description = description;
        }
    }

    public class EditData
    {
        public string username { get; set; }
        public string firstName { get; set; }
        public string lastName{ get; set; }
        public string profilePhoto { get; set; }
        public string description { get; set; }
    }

    public class Post
    {
        public int id { get; set; }
        public string user { get; set; }
        public string description { get; set; }
        public string image { get; set; }
        public int likes { get; set; }
        public int comments { get; set; }

        public Post(int id, string user, string description, string image, int likes, int comments)
        {
            this.id = id;
            this.user = user;
            this.description = description;
            this.image = image;
            this.likes = likes;
            this.comments = comments;
        }
    }

    public class LikePost
    {
        public int id { get; set; }
        public string username { get; set; }

        public LikePost(int id, string username)
        {
            this.id = id;
            this.username = username;
        }
    }
    
    public class Follow
    {
        public string username { get; set; }
        public string toFollow { get; set; }

        public Follow(string username, string toFollow)
        {
            this.username = username;
            this.toFollow = toFollow; 
        }
    }
}