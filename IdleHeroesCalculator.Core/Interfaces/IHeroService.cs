using IdleHeroesCalculator.Core.Models;
using System;
using System.Collections.Generic;

namespace IdleHeroesCalculator.Core.Interfaces
{
    public interface IHeroService
    {
        void CacheAllHeroes();
        Hero GetHero(string name, int stars);
        IEnumerable<Hero> GetAllHeroes();
        IEnumerable<Hero> GetHeroes(Func<Hero, bool> predicate);
    }
}
