using GraphQL.Types;
using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Core.Interfaces;
using IdleHeroesCalculator.Web.Graph.Types;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IdleHeroesCalculator.Web.Graph.Models
{
    public class IdleHeroesQuery : ObjectGraphType
    {
        public IdleHeroesQuery(IHeroDataService heroDataService, IHeroService heroService)
        {
            Name = "IdleHeroesQuery";

            Description = "Query used to retrieve information about characters in the Idle Heroes mobile game.";

            Field<ListGraphType<HeroDataGraphType>>(
                "heroData",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "name", Description = "Name of the hero." },
                    new QueryArgument<RoleGraphType> { Name = "role", Description = "The role of the hero." }, 
                    new QueryArgument<FactionGraphType> { Name = "faction", Description = "The faction of the hero." }
                ),
                resolve: context =>
                {
                    var name = context.GetArgument<String>("name");
                    var role = context.GetArgument<Roles?>("role");
                    var faction = context.GetArgument<Factions?>("faction");
                    var heroData = heroDataService.GetAllHeroes();

                    if (role.HasValue)
                        heroData = heroData.Where(x => x.Role == role.Value);

                    if (faction.HasValue)
                        heroData = heroData.Where(x => x.Faction == faction.Value);

                    if (!string.IsNullOrEmpty(name))
                    {
                        var names = name.Split(',');
                        heroData = heroData.Where(x => names.Contains(x.Name, StringComparer.InvariantCultureIgnoreCase));
                    }

                    return heroData;
                }
            );

            Field<ListGraphType<HeroGraphType>>(
                "heroes",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "take", Description = "The max number of heroes to return." },
                    new QueryArgument<IntGraphType> { Name = "skip", Description = "The number of heroes to skip." },
                    new QueryArgument<StringGraphType> { Name = "search", Description = "Search text for hero results." },
                    new QueryArgument<ListGraphType<IntGraphType>> { Name = "stars", Description = "The stars of the hero." },
                    new QueryArgument<ListGraphType<StringGraphType>> { Name = "names", Description = "Name of the hero instance." },
                    new QueryArgument<ListGraphType<FactionGraphType>> { Name = "factions", Description = "The factions of the heroes to return." },
                    new QueryArgument<ListGraphType<RoleGraphType>> { Name = "roles", Description = "The roles of the heroes to return." },
                    new QueryArgument<ListGraphType<StringGraphType>> { Name = "orderBy", Description = "Ordering fields for results." }
                ),
                resolve: context =>
                {
                    var take = context.GetArgument<int?>("take");
                    var skip = context.GetArgument<int?>("skip");
                    var search = context.GetArgument<string>("search");
                    var names = context.GetArgument<IEnumerable<string>>("names");
                    var stars = context.GetArgument<IEnumerable<int>>("stars");
                    var factions = context.GetArgument<IEnumerable<Factions>>("factions");
                    var roles = context.GetArgument<IEnumerable<Roles>>("roles");
                    var orderBy = context.GetArgument<IEnumerable<string>>("orderBy");

                    var heroes = heroService.GetAllHeroes();

                    if (names != null && names.Any())
                        heroes = heroes.Where(x => names.Contains(x.Name, StringComparer.InvariantCultureIgnoreCase));

                    if (factions != null && factions.Any())
                        heroes = heroes.Where(x => factions.Contains(x.Faction));

                    if (roles != null & roles.Any())
                        heroes = heroes.Where(x => roles.Contains(x.Role));

                    if (stars != null && stars.Any())
                        heroes = heroes.Where(x => stars.Contains(x.Stars));

                    if (!string.IsNullOrEmpty(search))
                        heroes = heroes.Where(x => x.Name.ToLower().Contains(search.ToLower()));
                    
                    if (orderBy != null && orderBy.Any())
                    {
                        for(var i = orderBy.Count() - 1; i >= 0; i--)
                        {
                            var itemSplit = orderBy.ElementAt(i).Split(':');
                            var prop = itemSplit.ElementAtOrDefault(0);
                            var direction = itemSplit.ElementAtOrDefault(1);

                            heroes = heroes.OrderByPropertyName(prop, direction);
                        }
                    }

                    if (skip.HasValue)
                        heroes = heroes.Skip(skip.Value);

                    if (take.HasValue)
                        heroes = heroes.Take(take.Value);
                    
                    return heroes;
                }
            );

            Field<HeroGraphType>(
                "hero",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name", Description = "Name of the hero instance." },
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "stars", Description = "Number of stars of the hero instance." }
                ),
                resolve: context =>
                {
                    var name = context.GetArgument<string>("name");
                    var stars = context.GetArgument<int>("stars");
                    var hero = heroService.GetHero(name, stars);
                    return hero;
                }
            );
        }
    }
}
