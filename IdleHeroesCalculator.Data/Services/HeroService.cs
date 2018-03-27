using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Core.Interfaces;
using IdleHeroesCalculator.Core.Models;
using IdleHeroesCalculator.Data.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IdleHeroesCalculator.Data.Services
{
    public class HeroService : IHeroService
    {
        private readonly IHeroDataService _heroService;

        public HeroService(IHeroDataService heroService)
        {
            _heroService = heroService;
        }

        public Hero GetHero(string name, int stars)
        {
            var faction = EnumExtensions.ParseEnum(name, Factions.Unknown);
            if(faction != Factions.Unknown)
            {
                return new Hero()
                {
                    Name = name,
                    Stars = stars,
                    MinStars = 4,
                    MaxStars = 9,
                    Faction = faction,
                    Role = Roles.Unknown
                };
            }

            var hero = _heroService.GetHero(name);
            if (hero == null) return null;
            return new Hero(hero)
            {
                Stars = stars
            };
        }

        public IEnumerable<Hero> GetAllHeroes()
        {
            var result = new List<Hero>();
            var allHeroes = _heroService.GetAllHeroes();
            foreach (var hero in allHeroes)
            {
                for (int i = hero.MinStars; i <= hero.MaxStars; i++)
                {
                    result.Add(new Hero(hero)
                    {
                        Stars = i
                    });
                }
            }
            return result;
        }

        public IEnumerable<Hero> GetHeroes(Func<Hero, bool> predicate)
        {
            return GetAllHeroes().Where(predicate).ToList();
        }
    }
}
