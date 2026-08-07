import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/services/api_service.dart';
import '../../../core/services/storage_service.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/getvnt_logo.dart';
import '../../dashboard/screens/dashboard_screen.dart';
import '../../onboarding/screens/guided_tour_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'admin@getvnt.com');
  final _passwordController = TextEditingController(text: 'password');
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _handleLogin() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await ApiService.post(ApiEndpoints.login, {
      'email': _emailController.text.trim(),
      'password': _passwordController.text.trim(),
    });

    setState(() => _isLoading = false);

    if (res['success'] == true || res['token'] != null) {
      final token = res['token'] ?? 'mock_organizer_jwt_token';
      final user = res['user'] ?? {
        'name': 'Executive Organizer',
        'email': _emailController.text,
        'role': 'organizer_admin',
        'tenant': {'name': 'Getvnt Events'}
      };

      await StorageService.saveToken(token);
      await StorageService.saveUserData(user);

      if (!mounted) return;

      final tourDone = await StorageService.isTourCompleted();
      if (!tourDone) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const GuidedTourScreen()),
        );
      } else {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const DashboardScreen()),
        );
      }
    } else {
      setState(() {
        _errorMessage = res['message'] ?? 'Invalid credentials. Please check your email and password.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCanvas,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Center(child: GetvntLogo(size: 44)),
                const SizedBox(height: 12),
                const Text(
                  'Organizer & Staff Portal',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 36),

                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.bgSurface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Welcome back',
                        style: TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Sign in to manage your events, check-ins, and operations.',
                        style: TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 24),

                      if (_errorMessage != null) ...[
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.dangerBg,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppColors.danger.withOpacity(0.3)),
                          ),
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(color: AppColors.danger, fontSize: 13),
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      CustomTextField(
                        label: 'Email address',
                        controller: _emailController,
                        hint: 'organizer@company.com',
                        keyboardType: TextInputType.emailAddress,
                        prefixIcon: Icons.email_outlined,
                      ),

                      CustomTextField(
                        label: 'Password',
                        controller: _passwordController,
                        hint: '••••••••',
                        obscureText: true,
                        prefixIcon: Icons.lock_outline,
                      ),

                      CustomButton(
                        text: 'Sign In to Workspace',
                        onPressed: _handleLogin,
                        isLoading: _isLoading,
                        icon: Icons.login,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
