using IdleHeroesCalculator.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdleHeroesCalculator.Core.Interfaces
{
    public interface IUpgradeDataService : IDataService
    {
        Costs GetCosts(Hero hero);
        IEnumerable<Costs> GetCosts(Hero hero, int fromStars, int toStars);
    }
}