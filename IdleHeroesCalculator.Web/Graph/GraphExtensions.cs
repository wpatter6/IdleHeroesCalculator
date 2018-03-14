using GraphQL.Language.AST;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IdleHeroesCalculator.Web.Graph
{
    internal static class GraphExtensions
    {
        public static TEnum ParseEnumValue<TEnum>(this IValue value) where TEnum : struct, IConvertible
        {
            return ParseEnumValue(value, default(TEnum));
        }
        public static TEnum ParseEnumValue<TEnum>(this IValue value, TEnum defaultValue) where TEnum : struct, IConvertible
        {
            if (!typeof(TEnum).IsEnum) 
            {
                throw new ArgumentException("TEnum must be an enumerated type");
            }

            var result = defaultValue;
            if(value is StringValue && Enum.TryParse(((StringValue)value).Value, true, out result))
            {
                return result;
            }
            else if(value is IntValue)
            {
                var intValue = ((IntValue)value).Value;
                if(Enum.IsDefined(typeof(TEnum), intValue))
                {
                    return (TEnum)(object)intValue;
                }
            }
            return result;
        }

        public static IEnumerable<T> OrderByPropertyName<T>(this IEnumerable<T> list, string propertyName, string direction = "ASC")
        {
            var prop = typeof(T).GetProperty(propertyName, BindingFlags.IgnoreCase |  BindingFlags.Public | BindingFlags.Instance);

            if(!string.IsNullOrEmpty(direction) && direction.ToLower().StartsWith("desc"))
                return list.OrderByDescending(x => prop.GetValue(x, null)).ToList();

            return list.OrderBy(x => prop.GetValue(x, null)).ToList();
        }
    }
}
