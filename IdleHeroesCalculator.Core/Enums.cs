using System;
using System.ComponentModel;
using System.Linq;

namespace IdleHeroesCalculator.Core
{
    public enum Factions
    {
        [Description("https://cdn.iconscout.com/public/images/icon/premium/png-512/help-need-suggestion-question-unknown-3879c7158022355d-512x512.png")]
        Unknown = 0,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/a/a6/Light.png/revision/latest")]
        Light = 1,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/0/0e/Dark.png/revision/latest")]
        Dark = 2,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/c/c1/Forest.png/revision/latest")]
        Forest = 3,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/9/96/Fortress.png/revision/latest")]
        Fortress = 4,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/7/7b/Abyss.png/revision/latest")]
        Abyss = 5,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/8/8e/Shadow.png/revision/latest")]
        Shadow = 6,
        [Description("https://cdn.iconscout.com/public/images/icon/premium/png-512/help-need-suggestion-question-unknown-3879c7158022355d-512x512.png")]
        Any = 7,
        [Description("https://cdn.iconscout.com/public/images/icon/premium/png-512/help-need-suggestion-question-unknown-3879c7158022355d-512x512.png")]
        Specific = 8
    }
    public enum Roles
    {
        [Description("https://cdn.iconscout.com/public/images/icon/premium/png-512/help-need-suggestion-question-unknown-3879c7158022355d-512x512.png")]
        Unknown = 0,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/6/69/Assassin.png/revision/latest")]
        Assassin = 1,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/2/20/Mage.png/revision/latest")]
        Mage = 2,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/1/14/Priest.png/revision/latest")]
        Priest = 3,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/9/97/Warrior.png/revision/latest")]
        Warrior = 4,
        [Description("https://vignette.wikia.nocookie.net/idleheroes/images/e/e9/Ranger.png/revision/latest")]
        Ranger = 5
    }
    public enum DataTypes
    {
        Hero,
        Upgrade
    }
}