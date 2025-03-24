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
        public IActionResult Register(RegisterData registerData)
        {
            MySqlConnection conn = Connection.GetConn();
            conn.Open();
            
            string query = "SELECT email FROM users";
            MySqlCommand cmd = new MySqlCommand(query, conn);
            using (MySqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    string email = reader["email"].ToString();
                    if (email.Equals(registerData.email))
                    {
                        throw new Exception("Email already in use");
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
        public IActionResult Login(LoginData loginData)
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
}