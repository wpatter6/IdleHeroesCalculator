using GraphQL.Language.AST;
using GraphQL.Types;
using IdleHeroesCalculator.Core;
using System;

namespace IdleHeroesCalculator.Web.Graph.Types
{
    public class RoleGraphType : EnumerationGraphType
    {
        public RoleGraphType()
        {
            Name = "Role";
            Description = "The role of the hero.";

            foreach (var val in Enum.GetValues(typeof(Roles)))
            {
                AddValue(new EnumValueDefinition()
                {
                    Name = val.ToString()
                });
            }
        }
        public override object ParseLiteral(IValue value)
        {
            var result = value.ParseEnumValue<Roles>();
            if (result != Roles.Unknown) return result;
            return base.ParseLiteral(value);
        }
    }
}
