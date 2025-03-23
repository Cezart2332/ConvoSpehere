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
            string query = "INSERT INTO users (username,email, password) VALUES (@username,@email, @password)";
            MySqlCommand cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@username", registerData.username);
            cmd.Parameters.AddWithValue("@email", registerData.email);
            cmd.Parameters.AddWithValue("@password", BCrypt.Net.BCrypt.HashPassword(registerData.password, 13));
            int l = cmd.ExecuteNonQuery();
            conn.Close();
            return Ok(505);
        }
    }

    public class RegisterData()
    {
        public string username { get; set; }
        public string email { get; set; }
        
        public string password { get; set; }
    }
}