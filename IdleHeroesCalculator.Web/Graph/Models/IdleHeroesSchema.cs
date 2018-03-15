using System;
using GraphQL.Types;
using IdleHeroesCalculator.Core.Interfaces;
using IdleHeroesCalculator.Web.Graph.Types;

namespace IdleHeroesCalculator.Web.Graph.Models
{
    public class IdleHeroesSchema : Schema
    {
        public IdleHeroesSchema (Func<Type, GraphType> resolveType, IUpgradeService upgradeService)
            : base(resolveType)
        {
            Query = (IdleHeroesQuery)resolveType(typeof(IdleHeroesQuery));

            RegisterTypes(new FactionGraphType(), new RoleGraphType(), new HeroDataGraphType(), new HeroGraphType(upgradeService), new FactionDetailsGraphType(), new RoleDetailsGraphType());
        }
    }
}
