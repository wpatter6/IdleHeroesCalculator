using System;
using System.Collections.Generic;
using System.Text;

namespace IdleHeroesCalculator.Core.Models
{
    public class HeroData
    {
        public HeroData() { }
        public HeroData(HeroData hero)
        {
            if(hero != null)
            {
                Faction = hero.Faction;
                Role = hero.Role;
                Name = hero.Name;
                Img1 = hero.Img1;
                Img2 = hero.Img2;
                Img3 = hero.Img3;
                MaxStars = hero.MaxStars;
                MinStars = hero.MinStars;
                Url = hero.Url;
                Fodder1 = hero.Fodder1;
                Fodder2 = hero.Fodder2;
            }
        }
        /// <summary>
        /// Faction of the hero, ex Abyss, Shadow, etc.
        /// </summary>
        public Factions Faction { get; set; }
        /// <summary>
        /// Faction of the hero, Internal Id for enum.
        /// </summary>
        public int FactionId { get { return (short)Faction; } }
        /// <summary>
        /// Class of the hero, ex Assassin, Priest, etc.
        /// </summary>
        public Roles Role { get; set; }
        /// <summary>
        /// Class of the hero, Internal Id for enum.
        /// </summary>
        public int RoleId { get { return (short)Role; } }
        /// <summary>
        /// Name of the hero.
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Url link to the wiki.
        /// </summary>
        public string Url { get; set; }
        /// <summary>
        /// Image url for lowest star level.
        /// </summary>
        public string Img1 { get; set; }
        /// <summary>
        /// Image url for middle star level.
        /// </summary>
        public string Img2 { get; set; }
        /// <summary>
        /// Image url for max star level.
        /// </summary>
        public string Img3 { get; set; }
        /// <summary>
        /// Smallest number of possible stars for the hero.
        /// </summary>
        public int MinStars { get; set; }
        /// <summary>
        /// Largest number of possible stars for the hero.
        /// </summary>
        public int MaxStars { get; set; }
        /// <summary>
        /// Name of the first hero required to perform a fusion for this hero.
        /// </summary>
        public string Fodder1 { get; set; }
        /// <summary>
        /// Name of the second hero required to perform a fusion for this hero.
        /// </summary>
        public string Fodder2 { get; set; }
    }
}