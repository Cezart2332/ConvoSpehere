using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace WebScrapper
{
    class Program
    {
        static void Main(string[] args)
        {
            // Setarea opțiunilor pentru Chrome
            ChromeOptions options = new ChromeOptions();
            options.AddArgument("--headless");

            // Inițializează driver-ul
            using (IWebDriver driver = new ChromeDriver(options))
            {
                // Navighează la pagina de căutare Google
                driver.Navigate().GoToUrl("https://www.google.com/search?q=constanta+restaurante");

                // Exemplu: Caută elemente care conțin informații despre locații
                var elements = driver.FindElements(By.CssSelector("div.BNeawe"));
                foreach (var element in elements)
                {
                    Console.WriteLine(element.Text);
                }
            }
        }
    }
}