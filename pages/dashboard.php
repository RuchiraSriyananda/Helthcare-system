<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../services/DashboardService.php';

$dashboardService = new DashboardService();
$stats = $dashboardService->getDashboardStats($_SESSION['user_id'], $_SESSION['role']);
?>

<div class="dashboard-container">
  <!-- Header -->
  <div class="dashboard-header">
    <h1 class="text-3xl font-bold text-gray-900">Welcome, <?= htmlspecialchars($_SESSION['first_name']) ?></h1>
    <p class="text-gray-600"><?= $dashboardService->getWelcomeMessage($_SESSION['role']) ?></p>
  </div>

  <!-- Stats Cards -->
  <div class="stats-grid">
    <?php foreach ($stats as $stat): ?>
      <div class="stat-card bg-white rounded-xl shadow-sm border-l-4 border-<?= $stat['color'] ?>-500">
        <div class="stat-content">
          <p class="stat-label"><?= $stat['label'] ?></p>
          <p class="stat-value"><?= $stat['value'] ?></p>
        </div>
        <div class="stat-icon">
          <i class="<?= $stat['icon'] ?> text-<?= $stat['color'] ?>-500"></i>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <!-- Charts Section -->
  <?php if ($_SESSION['role'] === 'doctor' || $_SESSION['role'] === 'admin'): ?>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Appointment Distribution</h3>
        <canvas id="appointmentChart" width="400" height="250"></canvas>
      </div>
      <div class="chart-card">
        <h3>Patient Visits</h3>
        <canvas id="patientChart" width="400" height="250"></canvas>
      </div>
    </div>
  <?php endif; ?>

  <!-- Quick Actions -->
  <div class="quick-actions">
    <h3 class="section-title">Quick Actions</h3>
    <div class="actions-grid">
      <?php foreach ($dashboardService->getQuickActions($_SESSION['role']) as $action): ?>
        <a href="<?= $action['link'] ?>" class="action-card">
          <div class="action-icon bg-<?= $action['color'] ?>-100 text-<?= $action['color'] ?>-600">
            <i class="<?= $action['icon'] ?>"></i>
          </div>
          <div class="action-content">
            <h4><?= $action['title'] ?></h4>
            <p><?= $action['description'] ?></p>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</div>

<script src="/assets/js/dashboard.js"></script>