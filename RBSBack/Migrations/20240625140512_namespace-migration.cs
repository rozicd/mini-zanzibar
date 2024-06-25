using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RBSBack.Migrations
{
    /// <inheritdoc />
    public partial class namespacemigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NameSpace",
                table: "Notes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NameSpace",
                table: "Notes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
