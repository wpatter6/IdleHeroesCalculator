using GraphQL.Types;
using IdleHeroesCalculator.Core.Interfaces;
using IdleHeroesCalculator.Core.Models;
using IdleHeroesCalculator.Data.Extensions;
using System.Linq;

namespace IdleHeroesCalculator.Web.Graph.Types
{
    public class HeroGraphType : ObjectGraphType<Hero>
    {
        public HeroGraphType(IUpgradeDataService upgradeCostService)
        {
            Name = "Hero";

            Description = "An instance of a hero with a specified number of stars and upgrade costs.";
            
            Field(x => x.Name).Description("The name of the hero.");

            Field(x => x.Stars).Description("The number of stars for the current hero.");

            Field(x => x.FactionId).Description("Internal Id for hero faction.");

            Field(x => x.RoleId).Description("Internal Id for hero faction.");

            Field(x => x.Faction, type: typeof(FactionGraphType)).Description("The hero's faction.");

            Field(x => x.Role, type: typeof(RoleGraphType)).Description("The hero's role.");
            
            Field<BooleanGraphType>(
                "isFusion", 
                "Returns true if the current level is evolved to in the creation circle.",
                resolve: context => upgradeCostService.GetCosts(context.Source)?.IsFusion
            );

            Field<IntGraphType>(
                "minSpirit", 
                "The minimum amount of spirit to spend going to star's min level this from previous star min level (ex: from 6 to 7).",
                resolve: context => upgradeCostService.GetCosts(context.Source)?.MinSpirit
            );

            Field<IntGraphType>(
                "maxSpirit", 
                "The full amount of spirit to spend going to star's max level from the previous star's max level.",
                resolve: context => upgradeCostService.GetCosts(context.Source)?.MaxSpirit
            );

            Field<IntGraphType>(
                "minGold", 
                "The minimum amount of gold to spend going to star's min level this from previous star min level (ex: from 6 to 7).",
                resolve: context => upgradeCostService.GetCosts(context.Source)?.MinGold
            );

            Field<IntGraphType>(
                "maxGold", 
                "The full amount of gold to spend going to star's max level from the previous star's max level.",
                resolve: context => upgradeCostService.GetCosts(context.Source)?.MaxGold
            );

            Field<IntGraphType>(
                "minStones", 
                "The minimum amount of stones to spend going to star's min level this from previous star min level (ex: from 6 to 7).",
                resolve: context => upgradeCostService.GetCosts(context.Source)?.MinStones
            );

            Field<IntGraphType>(
                "maxStones", 
                "The full amount of stones to spend going to star's max level from the previous star's max level.",
                resolve: context => upgradeCostService.GetCosts(context.Source)?.MaxStones
            );

            Field<ListGraphType<HeroGraphType>>(
                "fodder",
                "All of the fodder heroes required to upgrade.",
                resolve: context => upgradeCostService.GetCosts(context.Source)?.Fodder
            );
            
            Field<StringGraphType>(
                "url", 
                "The url for the hero's wiki entry.",
                resolve: context => context.Source.GetUrl()
            );

            Field<StringGraphType>(
                "img", 
                "The url for the current hero's image.",
                resolve: context => context.Source.GetImg()
            );
        }
    }
}
