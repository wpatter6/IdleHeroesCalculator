using GraphQL.Language.AST;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using IdleHeroesCalculator.Data.Extensions;

namespace IdleHeroesCalculator.Web.Graph
{
    internal static class GraphExtensions
    {
        public static TEnum ParseEnumValue<TEnum>(this IValue value) where TEnum : struct, IConvertible
        {
            return ParseEnumValue(value, default(TEnum));
        }
        public static TEnum ParseEnumValue<TEnum>(this IValue value, TEnum defaultValue = default(TEnum)) where TEnum : struct, IConvertible
        {
            if (!typeof(TEnum).IsEnum) 
            {
                throw new ArgumentException("TEnum must be an enumerated type");
            }
            
            if(value is StringValue)
            {
                return EnumExtensions.ParseEnum(((StringValue)value).Value, defaultValue);
            }
            else if(value is IntValue)
            {
                return EnumExtensions.ParseEnum(((IntValue)value).Value, defaultValue);
            }
            return defaultValue;
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
