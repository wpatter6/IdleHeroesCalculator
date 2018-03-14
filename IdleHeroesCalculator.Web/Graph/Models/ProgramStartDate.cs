using System;
using System.Collections.Generic;
using System.Text;

namespace IdleHeroesCalculator.Web.Graph.Models
{
    public class ProgramStartDate
    {
        public ProgramStartDate()
        {
            StartDate = DateTime.UtcNow;
            
            StartDateUnixTicks = new TimeSpan(StartDate.ToUniversalTime().Ticks - new DateTime(1970, 1, 1).Ticks).TotalMilliseconds;
        }
        public DateTime StartDate { get; set; }

        public double StartDateUnixTicks { get; set; }
    }
}
