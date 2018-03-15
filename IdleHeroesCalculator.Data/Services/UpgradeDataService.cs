using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Core.Interfaces;
using IdleHeroesCalculator.Core.Models;
using IdleHeroesCalculator.Data.SQLite;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace IdleHeroesCalculator.Data.Services
{
    public class UpgradeDataService : IUpgradeDataService
    {
        private DbConfiguration _config;
        private IRawDataService _rawDataService;
        public UpgradeDataService(IOptions<DbConfiguration> config, IRawDataService rawDataService)
        {
            _config = config.Value;
            _rawDataService = rawDataService;
        }
        public List<UpgradeData> GetAllUpgradeData()
        {
            using(var context = new SQLiteContext(_config))
            {
                return context.UpgradeData.ToList();
            }
        }

        public List<UpgradeData> GetUpgradeData(Expression<Func<UpgradeData, bool>> predicate)
        {
            using(var context = new SQLiteContext(_config))
            {
                return context.UpgradeData.Where(predicate).ToList();
            }
        }

        public async Task InitializeAsync()
        {
            using(var context = new SQLiteContext(_config))
            {
                await context.Database.EnsureCreatedAsync();

                await PopulateDataAsync(context);
            }
        }
        
        private async Task PopulateDataAsync(SQLiteContext context)
        {
            var path = string.Format("{0}{1}", Directory.GetCurrentDirectory(), _config.DataPaths[DataTypes.Upgrade]);
            var dataInDb = context.UpgradeData.Select(x => x.ToStars).ToList();
            var newData = _rawDataService.GetRecords<UpgradeData>(path, x => !dataInDb.Contains(x.ToStars));
            
            if(newData.Count() > 0)
            {
                context.UpgradeData.AddRange(newData);
                await context.SaveChangesAsync();
            }
        }
    }
}
