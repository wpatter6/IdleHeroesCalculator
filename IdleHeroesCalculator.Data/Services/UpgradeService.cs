using CsvHelper;
using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Core.Interfaces;
using IdleHeroesCalculator.Core.Models;
using IdleHeroesCalculator.Data.SQLite;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdleHeroesCalculator.Data.Services
{
    public class UpgradeService : IUpgradeService
    {
        private readonly IUpgradeDataService _upgradeDataService;
        private readonly IHeroDataService _heroDataService;

        private const string _defaultHeroName = "Any";

        public UpgradeService (IUpgradeDataService upgradeDataService, IHeroDataService heroDataService)
        {
            _upgradeDataService = upgradeDataService;
            _heroDataService = heroDataService;
        }
        public IEnumerable<Costs> GetCosts(Hero hero, int fromStars, int toStars)
        {
            if (fromStars <= 0)
                fromStars = hero.Stars - 1;
            if (toStars <= 0)
                toStars = hero.Stars;
            
            var costs = GetUpgradeRequirementsBase(fromStars, toStars, hero);

            return costs;
        }

        public Costs GetCosts(Hero hero)
        {
            if (!hero.HasCosts) return null;
            if (hero.Costs != null) return hero.Costs;

            var costs = GetCosts(hero, 0, 0)?.FirstOrDefault();
            hero.Costs = costs;

            return costs;
        }

        private IEnumerable<Costs> GetUpgradeRequirementsBase(int fromStars, int toStars, Hero upgradeHero = null)
        {
            if (upgradeHero != null && toStars == upgradeHero.MinStars) return null;

            var upgradeData = _upgradeDataService.GetUpgradeData(x => x.ToStars > fromStars && x.ToStars <= toStars);

            if (upgradeData.Count() == 0) return null;
            
            var result = new List<Costs>();

            if (upgradeHero == null)
            {
                upgradeHero = new Hero()
                {
                    Name = _defaultHeroName,
                    Faction = Factions.Specific,
                    Stars = toStars
                };
            }

            var currentFaction = upgradeHero.Faction == Factions.Any ? Factions.Specific : upgradeHero.Faction;
            var fodderHeroName = upgradeHero.Stars - 1 == upgradeHero.MinStars ? upgradeHero.Fodder1 : upgradeHero.Fodder2 ?? upgradeHero.Fodder1;

            foreach (var item in upgradeData)
            {
                var fodderList = new List<Hero>();
                var req = new Costs()
                {
                    IsFusion = item.IsFusion,
                    MinStones = item.MinStones,
                    MaxStones = item.MaxStones,
                    MinSpirit = item.MinSpirit,
                    MaxSpirit = item.MaxSpirit,
                    MinGold = item.MinGold,
                    MaxGold = item.MaxGold,
                    ToStars = item.ToStars,
                    FromStars = item.ToStars - 1,
                    Hero = upgradeHero
                };

                //Always need one of our current
                var currentHero = new Hero(upgradeHero)
                {
                    Stars = upgradeHero.Stars - 1
                };

                //if(currentHero.HasCosts)
                //    currentHero.Costs = GetCosts(currentHero);

                fodderList.Add(currentHero);

                //Any additional of the current
                for (var i = 0; i < item.CurrentHeroCount; i++)
                {
                    fodderList.Add(new Hero(upgradeHero)
                    {
                        Stars = item.CurrentHeroStars
                    });
                }

                //Get specific fodder heroes
                var fodderHero = new Hero(_heroDataService.GetHero(fodderHeroName)) { Stars = item.SpecificFodderHeroStars };
                for (var i = 0; i < item.SpecificFodderHeroCount; i++)
                {
                    fodderList.Add(new Hero(fodderHero)
                    {
                        Name = fodderHero?.Name ?? currentFaction.ToString(),
                        Faction = currentFaction,
                        Stars = item.SpecificFodderHeroStars
                    });
                }
                
                //Get typed fodder heroes
                for (var i = 0; i < item.TypedFodderHeroCount; i++)
                {
                    fodderList.Add(new Hero()
                    {
                        Name = currentFaction.ToString(),
                        Faction = currentFaction,
                        Stars = item.TypedFodderHeroStars
                    });
                }
                
                for (var i = 0; i < item.TypedFodderHeroCount2; i++)
                {
                    fodderList.Add(new Hero()
                    {
                        Name = currentFaction.ToString(),
                        Faction = currentFaction,
                        Stars = item.TypedFodderHeroStars2
                    });
                }
                
                for (var i = 0; i < item.AnyFodderHeroCount; i++)
                {
                    fodderList.Add(new Hero()
                    {
                        Name = Factions.Any.ToString(),
                        Faction = Factions.Any,
                        Stars = item.AnyFodderHeroStars
                    });
                }
                req.Fodder = fodderList;
                result.Add(req);
            }
            return result;
        }
    }
}
