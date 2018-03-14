using GraphQL.Types;
using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Data.Extensions;

namespace IdleHeroesCalculator.Web.Graph.Types
{
    public class RoleDetailsGraphType : ObjectGraphType<Roles>
    {
        public RoleDetailsGraphType()
        {
            Name = "RoleDetails";
            Description = "Information about the roles enum items.";

            Field<IntGraphType>(
                "id",
                "The calculator's internal Id of the role.",
                resolve: context => (int)context.Source
            );

            Field<StringGraphType>(
                "name",
                "The name of the faction.",
                resolve: context => context.Source.ToString()
            );

            Field<StringGraphType>(
                "img",
                "The url for the image representing the role.",
                resolve: context => context.Source.GetDescription()
            );
        }
    }
}
