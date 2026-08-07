<?php

namespace App\Console\Commands;

use App\Services\NewsAggregationService;
use Illuminate\Console\Command;

class ImportFeeds extends Command
{
    protected $signature = 'feeds:import {--force}';
    protected $description = 'Import news feeds and generate articles';

    protected $newsAggregationService;

    public function __construct(NewsAggregationService $newsAggregationService)
    {
        parent::__construct();
        $this->newsAggregationService = $newsAggregationService;
    }

    public function handle()
    {
        $this->info('Starting news feed import...');
        $newArticles = $this->newsAggregationService->aggregate();

        $this->info("Successfully imported {$newArticles} new articles.");
        return 0;
    }
}