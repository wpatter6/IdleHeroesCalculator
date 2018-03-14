using GraphQL.Language.AST;
using GraphQL.Types;
using IdleHeroesCalculator.Core;
using System;

namespace IdleHeroesCalculator.Web.Graph.Types
{
    public class FactionGraphType : EnumerationGraphType
    {
        public FactionGraphType()
        {
            Name = "Faction";
            Description = "The faction of the hero.";
            
            foreach (var val in Enum.GetValues(typeof(Factions)))
            {
                AddValue(new EnumValueDefinition()
                {
                    Name = val.ToString()
                });
            }
        }

        public override object ParseLiteral(IValue value)
        {
            var result = value.ParseEnumValue<Factions>();
            if (result != Factions.Unknown) return result;
            return base.ParseLiteral(value);
        }
    }
}
