<?php

namespace Database\Seeders;

use App\Models\Cuisine;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CuisineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cuisines = [
            [
                'name' => 'Rendang',
                'description' => 'Masakan daging sapi yang dimasak dalam santan dan rempah-rempah khas Minangkabau',
                'origin_region' => 'Sumatera Barat',
                'category' => 'makanan_berat',
            ],
            [
                'name' => 'Gudeg',
                'description' => 'Makanan khas Yogyakarta yang terbuat dari nangka muda yang dimasak dengan santan',
                'origin_region' => 'Yogyakarta',
                'category' => 'makanan_berat',
            ],
            [
                'name' => 'Pempek',
                'description' => 'Makanan khas Palembang berbahan dasar ikan dan sagu',
                'origin_region' => 'Sumatera Selatan',
                'category' => 'makanan_berat',
            ],
            [
                'name' => 'Soto Lamongan',
                'description' => 'Soto khas Lamongan dengan kuah bening dan irisan ayam',
                'origin_region' => 'Jawa Timur',
                'category' => 'makanan_berat',
            ],
            [
                'name' => 'Kerak Telor',
                'description' => 'Makanan tradisional Betawi yang terbuat dari beras ketan putih, telur ayam, ebi yang disangrai kering ditambah bawang merah goreng',
                'origin_region' => 'Jakarta',
                'category' => 'makanan_ringan',
            ],
            [
                'name' => 'Klepon',
                'description' => 'Kue tradisional berbentuk bulat kecil yang terbuat dari tepung beras ketan',
                'origin_region' => 'Jawa Tengah',
                'category' => 'dessert',
            ],
            [
                'name' => 'Es Cendol',
                'description' => 'Minuman segar khas Indonesia yang terbuat dari tepung beras, santan, dan gula merah',
                'origin_region' => 'Jawa Barat',
                'category' => 'minuman',
            ],
            [
                'name' => 'Ayam Betutu',
                'description' => 'Ayam utuh yang dibumbui dengan bumbu Base Gede khas Bali',
                'origin_region' => 'Bali',
                'category' => 'lauk_pauk',
            ],
            [
                'name' => 'Papeda',
                'description' => 'Makanan pokok tradisional Papua yang terbuat dari tepung sagu',
                'origin_region' => 'Papua',
                'category' => 'makanan_berat',
            ],
            [
                'name' => 'Rujak Cingur',
                'description' => 'Rujak khas Surabaya dengan campuran sayuran, buah, dan cingur (moncong sapi)',
                'origin_region' => 'Jawa Timur',
                'category' => 'makanan_ringan',
            ],
        ];

        foreach ($cuisines as $cuisine) {
            Cuisine::create($cuisine);
        }
    }
}
