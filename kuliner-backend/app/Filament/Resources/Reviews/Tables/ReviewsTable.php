<?php

namespace App\Filament\Resources\Reviews\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ReviewsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->sortable()
                    ->searchable(),
                    
                TextColumn::make('vendor.name')
                    ->label('Vendor')
                    ->sortable()
                    ->searchable(),
                    
                TextColumn::make('rating')
                    ->label('Rating')
                    ->badge()
                    ->color(fn (int $state): string => match (true) {
                        $state >= 4 => 'success',
                        $state >= 3 => 'warning',
                        $state >= 2 => 'gray',
                        default => 'danger',
                    })
                    ->formatStateUsing(fn (int $state): string => $state . '/5 ⭐')
                    ->sortable(),
                    
                TextColumn::make('review_text')
                    ->label('Review')
                    ->limit(100)
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        if (strlen($state) <= 100) {
                            return null;
                        }
                        return $state;
                    }),
                    
                ImageColumn::make('photo')
                    ->label('Photo')
                    ->circular()
                    ->defaultImageUrl('/images/placeholder-review.jpg'),
                    
                TextColumn::make('likes_count')
                    ->label('Likes')
                    ->counts('likes')
                    ->sortable(),
                    
                TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('rating')
                    ->options([
                        1 => '1 Star',
                        2 => '2 Stars',
                        3 => '3 Stars',
                        4 => '4 Stars',
                        5 => '5 Stars',
                    ]),
                    
                SelectFilter::make('user_id')
                    ->label('User')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload(),
                    
                SelectFilter::make('vendor_id')
                    ->label('Vendor')
                    ->relationship('vendor', 'name')
                    ->searchable()
                    ->preload(),
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
