using IdleHeroesCalculator.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace IdleHeroesCalculator.Data.SQLite
{
    public class SQLiteContext : DbContext
    {
        public DbSet<HeroData> Heroes { get; set; }
        public DbSet<UpgradeData> UpgradeData { get; set; }

        private readonly string _connectionString;
        public SQLiteContext(DbConfiguration config)
        {
            _connectionString = config.ConnectionString;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(_connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<HeroData>().HasKey(t => t.Name);
            modelBuilder.Entity<UpgradeData>().HasKey(t => t.ToStars);
        }
    }
}
