using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Core.Models;

namespace IdleHeroesCalculator.Data.Extensions
{
    public static class HeroExtensions
    {
        public static string GetImg(this Hero hero)
        {
            string img1 = string.IsNullOrEmpty(hero.Img1) ? null : hero.Img1,
                img2 = string.IsNullOrEmpty(hero.Img2) ? null : hero.Img2,
                img3 = string.IsNullOrEmpty(hero.Img3) ? null : hero.Img3,
                defaultImage = hero.Faction.GetDescription();

            if (hero.Stars == hero.MaxStars || hero.MaxStars == 9 && hero.Stars > 5)
                return img1 ?? img2 ?? img3 ?? defaultImage;

            if ((hero.MaxStars == 10 && hero.Stars > 5) || (hero.MaxStars == 9 && hero.Stars > 4))
                return img2 ?? img1 ?? defaultImage;

            return img3 ?? img2 ?? img1 ?? defaultImage;
        }

        public static string GetUrl(this Hero hero)
        {
            if (!string.IsNullOrEmpty(hero.Url))
                return hero.Url;

            var fact = hero.Faction.ToString();

            if (hero.Faction == Factions.Any || hero.Faction == Factions.Unknown || hero.Faction == Factions.Specific)
                fact = "Heroes";

            return $"http://idleheroes.wikia.com/wiki/{fact}#{hero.Stars}.E2.98.85_Heroes";
        }
    }
}
