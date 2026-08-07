import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/storage_service.dart';
import '../../../widgets/custom_button.dart';
import '../../dashboard/screens/dashboard_screen.dart';

class GuidedTourScreen extends StatefulWidget {
  const GuidedTourScreen({super.key});

  @override
  State<GuidedTourScreen> createState() => _GuidedTourScreenState();
}

class _GuidedTourScreenState extends State<GuidedTourScreen> {
  int _currentStep = 0;

  final List<Map<String, String>> _steps = [
    {
      'title': '👋 Welcome to GETVNT Mobile OS',
      'desc': 'Your complete Event Commerce & Operations Command Center on Android.',
      'icon': '🚀',
    },
    {
      'title': '⚡ Live Event Operations & Analytics',
      'desc': 'Track real-time ticket sales, gross revenue, and check-in velocity on the go.',
      'icon': '📊',
    },
    {
      'title': '📷 High-Speed Offline QR Scanner',
      'desc': 'Scan attendee tickets in under 500ms. Works completely offline with automatic sync.',
      'icon': '🎟️',
    },
    {
      'title': '🤖 Enterprise AI Assistant Companion',
      'desc': 'Ask AI to write marketing copy, optimize ticket pricing, or generate executive summaries.',
      'icon': '🤖',
    },
  ];

  Future<void> _finishTour() async {
    await StorageService.setTourCompleted(true);
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const DashboardScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final step = _steps[_currentStep];

    return Scaffold(
      backgroundColor: AppColors.bgCanvas,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Step ${_currentStep + 1} of ${_steps.length}',
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  TextButton(
                    onPressed: _finishTour,
                    child: const Text('Skip', style: TextStyle(color: AppColors.textMuted)),
                  ),
                ],
              ),
              const Spacer(),

              Text(
                step['icon']!,
                style: const TextStyle(fontSize: 64),
              ),
              const SizedBox(height: 24),
              Text(
                step['title']!,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                step['desc']!,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 14,
                  height: 1.4,
                ),
              ),

              const Spacer(),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _steps.length,
                  (index) => Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: index == _currentStep ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: index == _currentStep ? AppColors.primary : Colors.white24,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),

              CustomButton(
                text: _currentStep == _steps.length - 1 ? 'Launch Workspace' : 'Continue →',
                onPressed: () {
                  if (_currentStep < _steps.length - 1) {
                    setState(() => _currentStep++);
                  } else {
                    _finishTour();
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
