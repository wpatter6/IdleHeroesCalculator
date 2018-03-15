using IdleHeroesCalculator.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace IdleHeroesCalculator.Core.Interfaces
{
    public interface IUpgradeService
    {
        Costs GetCosts(Hero hero);
        IEnumerable<Costs> GetCosts(Hero hero, int fromStars, int toStars);
    }
}

