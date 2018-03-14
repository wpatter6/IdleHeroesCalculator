using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using IdleHeroesCalculator.Core.Models;

namespace IdleHeroesCalculator.Core.Interfaces
{
    public interface IHeroDataService : IDataService
    {
        IEnumerable<HeroData> GetAllHeroes();
        IEnumerable<HeroData> GetHeroes(Func<HeroData, bool> predicate);
        HeroData GetHero(string name);
    }
}
