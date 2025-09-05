<?php

namespace App\Filament\Resources\Cuisines\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CuisinesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('photo')
                    ->label('Photo')
                    ->circular()
                    ->defaultImageUrl('/images/placeholder-cuisine.jpg'),
                    
                TextColumn::make('name')
                    ->label('Cuisine Name')
                    ->sortable()
                    ->searchable(),
                    
                TextColumn::make('origin_region')
                    ->label('Origin Region')
                    ->sortable()
                    ->searchable(),
                    
                TextColumn::make('category')
                    ->label('Category')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Main Course' => 'success',
                        'Appetizer' => 'info',
                        'Dessert' => 'warning',
                        'Snack' => 'secondary',
                        'Beverage' => 'primary',
                        'Traditional' => 'danger',
                        default => 'gray',
                    }),
                    
                TextColumn::make('description')
                    ->label('Description')
                    ->limit(50)
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        if (strlen($state) <= 50) {
                            return null;
                        }
                        return $state;
                    }),
                    
                TextColumn::make('vendors_count')
                    ->label('Vendors')
                    ->counts('vendors')
                    ->sortable(),
                    
                TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->options([
                        'Main Course' => 'Main Course',
                        'Appetizer' => 'Appetizer',
                        'Dessert' => 'Dessert',
                        'Snack' => 'Snack',
                        'Beverage' => 'Beverage',
                        'Traditional' => 'Traditional',
                    ]),
                    
                SelectFilter::make('origin_region')
                    ->options(function () {
                        return \App\Models\Cuisine::distinct()->pluck('origin_region', 'origin_region');
                    })
                    ->searchable(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
