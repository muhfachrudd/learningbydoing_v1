<?php

namespace App\Filament\Resources\Vendors\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class VendorsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('photo')
                    ->label('Photo')
                    ->circular()
                    ->defaultImageUrl('/images/placeholder-vendor.jpg'),
                    
                TextColumn::make('name')
                    ->label('Vendor Name')
                    ->sortable()
                    ->searchable(),
                    
                TextColumn::make('cuisine.name')
                    ->label('Cuisine Type')
                    ->sortable()
                    ->searchable(),
                    
                TextColumn::make('address')
                    ->label('Address')
                    ->limit(50)
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        if (strlen($state) <= 50) {
                            return null;
                        }
                        return $state;
                    }),
                    
                TextColumn::make('price_range')
                    ->label('Price Range')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Budget' => 'success',
                        'Mid-range' => 'warning',
                        'Premium' => 'danger',
                        default => 'gray',
                    }),
                    
                TextColumn::make('opening_hours')
                    ->label('Opening Hours')
                    ->limit(20),
                    
                TextColumn::make('contact')
                    ->label('Contact')
                    ->copyable(),
                    
                TextColumn::make('reviews_count')
                    ->label('Reviews')
                    ->counts('reviews')
                    ->sortable(),
                    
                TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('cuisine_id')
                    ->label('Cuisine Type')
                    ->relationship('cuisine', 'name')
                    ->searchable()
                    ->preload(),
                    
                SelectFilter::make('price_range')
                    ->label('Price Range')
                    ->options([
                        'Budget' => 'Budget',
                        'Mid-range' => 'Mid-range',
                        'Premium' => 'Premium',
                    ]),
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
