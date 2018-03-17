using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdleHeroesCalculator.Web.Controllers
{
    public class FusionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
