﻿using IdleHeroesCalculator.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace IdleHeroesCalculator.Core.Interfaces
{
    public interface IUpgradeDataService : IDataService
    {
        List<UpgradeData> GetAllUpgradeData();
        List<UpgradeData> GetUpgradeData(Expression<Func<UpgradeData, bool>> predicate);
    }
}