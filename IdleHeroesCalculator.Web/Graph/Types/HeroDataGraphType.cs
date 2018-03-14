using GraphQL.Types;
using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Core.Models;

namespace IdleHeroesCalculator.Web.Graph.Types
{
    public class HeroDataGraphType : ObjectGraphType<HeroData>
    {
        public HeroDataGraphType()
        {
            Name = "HeroData";

            Description = "The raw template data of a hero used to generate actual instances of heroes.";

            Field(x => x.Name, nullable: true).Description("The name of the hero.");
            Field(x => x.Url, nullable: true).Description("The url for the hero's wiki entry.");
            Field(x => x.Img1, nullable: true).Description("The url for the hero's first image.");
            Field(x => x.Img2, nullable: true).Description("The url for the hero's second image.");
            Field(x => x.Img3, nullable: true).Description("The url for the hero's third image.");
            Field(x => x.MinStars).Description("The minimum number of stars the hero can have.");
            Field(x => x.MaxStars).Description("The maximum number of stars the hero can have.");
            Field(x => x.Fodder1).Description("The first specific hero needed to fuse the hero.");
            Field(x => x.Fodder2).Description("The second specific hero needed to fuse the hero.");

            Field(x => x.FactionId).Description("Internal Id for hero faction.");
            Field(x => x.RoleId).Description("Internal Id for hero faction.");
            
            Field(x => x.Faction, false, typeof(FactionGraphType)).Description("The hero's faction.");
            Field(x => x.Role, false, typeof(RoleGraphType)).Description("The hero's role.");
        }
    }
}
