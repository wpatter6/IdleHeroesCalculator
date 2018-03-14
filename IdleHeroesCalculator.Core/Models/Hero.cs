using System;
using System.Collections.Generic;
using System.Text;

namespace IdleHeroesCalculator.Core.Models
{
    public class Hero : HeroData
    {
        public Hero()
        {
        }
        public Hero (HeroData hero) : base(hero)
        {
        }
        public Hero(Hero hero) : base(hero)
        {
            if(hero != null)
            {
                Level = hero.Level;
                Stars = hero.Stars;
            }
        }

        public Hero(Hero hero, Costs costs) : this(hero)
        {
            Costs = costs;
        }
        /// <summary>
        /// The actual number of stars this hero has.
        /// </summary>
        public int Stars { get; set; }
        /// <summary>
        /// The actual level this hero has.
        /// </summary>
        public int Level { get; set; }

        public bool HasCosts
        {
            get
            {
                return Stars > Math.Max(MinStars, 4);
            }
        }

        public Costs Costs { get; set; }
    }
}
