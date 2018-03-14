using GraphQL.Types;
using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Data.Extensions;

namespace IdleHeroesCalculator.Web.Graph.Types
{
    public class FactionDetailsGraphType : ObjectGraphType<Factions>
    {
        public FactionDetailsGraphType()
        {
            Name = "FactionDetails";
            Description = "Information about the factions enum items.";

            Field<IntGraphType>(
                "id",
                "The calculator's internal Id of the faction",
                resolve: context => (int)context.Source
            );

            Field<StringGraphType>(
                "name",
                "The name of the faction.",
                resolve: context => context.Source.ToString()
            );

            Field<StringGraphType>(
                "img",
                "The url for the image representing the faction.",
                resolve: context => context.Source.GetDescription()
            );
        }
    }
}
