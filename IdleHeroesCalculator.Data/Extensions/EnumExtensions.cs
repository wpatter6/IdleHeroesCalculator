using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IdleHeroesCalculator.Data.Extensions
{
    public static class EnumExtensions
    {
        public static string GetDescription(this Enum value)
        {
            var field = value.GetType().GetField( value.ToString() );
            var attributes = field.GetCustomAttributes( false );
            
            dynamic displayAttribute = null;

            if (attributes.Any())
            {
                displayAttribute = attributes.ElementAt(0);
            }

            // return description
            return displayAttribute?.Description;
        }

        public static TEnum ParseEnum<TEnum>(string value, TEnum defaultValue = default(TEnum)) where TEnum : struct, IConvertible
        {
            if (Enum.TryParse(value, true, out TEnum result))
            {
                return result;
            }
            return defaultValue;
        }

        public static TEnum ParseEnum<TEnum>(int value, TEnum defaultValue = default(TEnum)) where TEnum : struct, IConvertible
        {
            if(Enum.IsDefined(typeof(TEnum), value))
            {
                return (TEnum)(object)value;
            }
            return defaultValue;
        }
    }
}
