using System.Collections.Generic;
using System.Threading.Tasks;
using IdleHeroesCalculator.Core.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System.IO;
using IdleHeroesCalculator.Core;
using IdleHeroesCalculator.Data;
using IdleHeroesCalculator.Data.SQLite;
using IdleHeroesCalculator.Data.Services;
using IdleHeroesCalculator.Web.Graph.Models;
using GraphQL;
using GraphQL.Types;

namespace IdleHeroesCalculator.Web
{
    public class Startup
    {
        private ServiceProvider _serviceProvider;
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
                services.SetDependencies()
                    .InitializeDatabase()
                    .AddMvc();
            
            var heroInstanceService = services.BuildServiceProvider().GetService<IHeroService>();
            heroInstanceService.CacheAllHeroes();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            SetEnvironmentName(env);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }

        private IHostingEnvironment SetEnvironmentName(IHostingEnvironment env)
        {
#if DEBUG
            env.EnvironmentName = "Development";
#else
            env.EnvironmentName = "Production";
#endif
            return env;
        }
    }

    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection SetDependencies(this IServiceCollection services)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            
            services.AddTransient<IHeroDataService, HeroDataService>()
                .AddTransient<IHeroService, HeroService>()
                .AddTransient<IRawDataService, CsvRawDataService>()
                .AddTransient<IUpgradeDataService, UpgradeDataService>()
                .AddScoped<IDocumentExecuter, DocumentExecuter>()
                .AddScoped<IdleHeroesQuery>()
                .AddSingleton(new ProgramStartDate())
                .Configure<DbConfiguration>(options =>
                {
                    options.ConnectionString = config["ConnectionStrings:DefaultConnection"];

                    options.DataPaths = new Dictionary<DataTypes, string>()
                    {
                        { DataTypes.Hero, config["DataPaths:Hero"] },
                        { DataTypes.Upgrade, config["DataPaths:Upgrade"] }
                    };
                })
                .AddDbContext<SQLiteContext>();
            
            var serviceProvider = services.BuildServiceProvider();
            services.AddScoped<ISchema>(_ => new IdleHeroesSchema(type => (GraphType)serviceProvider.GetService(type),
                serviceProvider.GetService<IUpgradeDataService>()) { Query = serviceProvider.GetService<IdleHeroesQuery>() });
            
            return services;
        }

        internal static IServiceCollection InitializeDatabase(this IServiceCollection services)
        {
            var sp = services.BuildServiceProvider();
            var heroServiceTask = sp.GetService<IHeroDataService>().InitializeAsync();
            var upgradeServiceTask = sp.GetService<IUpgradeDataService>().InitializeAsync();
            
            Task.WaitAll(heroServiceTask, upgradeServiceTask);

            return services;
        }
    }
}