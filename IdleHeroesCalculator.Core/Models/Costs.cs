using System;
using System.Collections.Generic;
using System.Text;

namespace IdleHeroesCalculator.Core.Models
{
    public class Costs
    {
        /// <summary>
        /// The hero associated to the costs.
        /// </summary>
        public Hero Hero { get; set; }
        /// <summary>
        /// True if the upgrade is done in the creation circle.
        /// </summary>
        public bool IsFusion;
        /// <summary>
        /// The minimum amount of spirit to spend going to star's min level this from previous star min level (ex: from 6 to 7).
        /// </summary>
        public int MinSpirit { get; set; }
        /// <summary>
        /// The full amount of spirit to spend going to star's max level from the previous star's max level.
        /// </summary>
        public int MaxSpirit { get; set; }
        /// <summary>
        /// The minimum amount of gold to spend going to star's min level from the previous star's min level (ex: from 6 to 7).
        /// </summary>
        public int MinGold { get; set; }
        /// <summary>
        /// The full amount of gold to spend going to star's max level from the previous star's max level.
        /// </summary>
        public int MaxGold { get; set; }
        /// <summary>
        /// The cost in promotion stones required to make the upgrade
        /// </summary>
        public int MinStones { get; set; }
        /// <summary>
        /// The full cost in promotion stones required to make the upgrade from the previous star's max level to the current.
        /// </summary>
        public int MaxStones { get; set; }
        public int FromStars;
        public int ToStars;
        public IEnumerable<Hero> Fodder;
    }
}