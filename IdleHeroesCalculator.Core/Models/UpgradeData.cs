namespace IdleHeroesCalculator.Core.Models
{
    public class UpgradeData
    {
        /// <summary>
        /// The amount of stars to level up.
        /// </summary>
        public int ToStars { get; set; }
        /// <summary>
        /// True if the upgrade is done in the creation circle.
        /// </summary>
        public bool IsFusion { get; set; }
        /// <summary>
        /// The number of specifically named heroes required to make the upgrade.
        /// </summary>
        public int SpecificFodderHeroCount { get; set; }
        /// <summary>
        /// The star level for the specifically named heroes required to make the upgrade.
        /// </summary>
        public int SpecificFodderHeroStars { get; set; }
        /// <summary>
        /// The number of typed heroes required to make the upgrade.
        /// </summary>
        public int TypedFodderHeroCount { get; set; }
        /// <summary>
        /// The star level for the number of typed heroes required to make the upgrade.
        /// </summary>
        public int TypedFodderHeroStars { get; set; }
        /// <summary>
        /// The number of heroes in the second group of typed heroes required to make the upgrade (ex: when both 6 and 5 star heroes are required).
        /// </summary>
        public int TypedFodderHeroCount2 { get; set; }
        /// <summary>
        /// The star count for the second group of typed heroes required to make the upgrade (ex: when both 6 and 5 star heroes are required).
        /// </summary>
        public int TypedFodderHeroStars2 { get; set; }
        /// <summary>
        /// The number of "any" faction heroes required to make the upgrade (ex: from 9 to 10).
        /// </summary>
        public int AnyFodderHeroCount { get; set; }
        /// <summary>
        /// The star level of "any" faction heroes required to make the upgrade (ex: from 9 to 10).
        /// </summary>
        public int AnyFodderHeroStars { get; set; }
        /// <summary>
        /// The number of current hero extras required to make the upgrade.
        /// </summary>
        public int CurrentHeroCount { get; set; }
        /// <summary>
        /// The star level of the current hero extras required to make the upgrade.
        /// </summary>
        public int CurrentHeroStars { get; set; }
        /// <summary>
        /// The minimum amount of spirit to spend going to star's min level this from previous star min level (ex: from 6 to 7).
        /// </summary>
        public int MinSpirit { get; set; }
        /// <summary>
        /// The full amount of spirit to spend going to star's max level from the previous star's max level.
        /// </summary>
        public int MaxSpirit { get; set; }
        /// <summary>
        /// The minimum amount of gold to spend going to star's min level from the previous star's min level (ex: from 6 to 7).
        /// </summary>
        public int MinGold { get; set; }
        /// <summary>
        /// The full amount of gold to spend going to star's max level from the previous star's max level.
        /// </summary>
        public int MaxGold { get; set; }
        /// <summary>
        /// The cost in promotion stones required to make the upgrade
        /// </summary>
        public int MinStones { get; set; }
        /// <summary>
        /// The full cost in promotion stones required to make the upgrade from the previous star's max level to the current.
        /// </summary>
        public int MaxStones { get; set; }
    }
}
