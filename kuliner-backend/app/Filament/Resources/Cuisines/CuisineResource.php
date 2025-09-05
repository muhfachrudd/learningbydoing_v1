<?php

namespace App\Filament\Resources\Cuisines;

use App\Filament\Resources\Cuisines\Pages\CreateCuisine;
use App\Filament\Resources\Cuisines\Pages\EditCuisine;
use App\Filament\Resources\Cuisines\Pages\ListCuisines;
use App\Filament\Resources\Cuisines\Schemas\CuisineForm;
use App\Filament\Resources\Cuisines\Tables\CuisinesTable;
use App\Models\Cuisine;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CuisineResource extends Resource
{
    protected static ?string $model = Cuisine::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cake';

    protected static string|UnitEnum|null $navigationGroup = 'Master Data';

    protected static ?string $navigationLabel = 'Cuisines';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return CuisineForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CuisinesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCuisines::route('/'),
            'create' => CreateCuisine::route('/create'),
            'edit' => EditCuisine::route('/{record}/edit'),
        ];
    }
}
