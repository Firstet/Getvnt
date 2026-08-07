import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/constants/app_colors.dart';
import 'core/services/storage_service.dart';
import 'features/authentication/screens/login_screen.dart';
import 'features/dashboard/screens/dashboard_screen.dart';
import 'features/onboarding/screens/guided_tour_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final token = await StorageService.getToken();
  final tourDone = await StorageService.isTourCompleted();

  Widget initialScreen;
  if (token != null && token.isNotEmpty) {
    if (!tourDone) {
      initialScreen = const GuidedTourScreen();
    } else {
      initialScreen = const DashboardScreen();
    }
  } else {
    initialScreen = const LoginScreen();
  }

  runApp(GetvntMobileApp(initialScreen: initialScreen));
}

class GetvntMobileApp extends StatelessWidget {
  final Widget initialScreen;

  const GetvntMobileApp({super.key, required this.initialScreen});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GETVNT Mobile OS',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.bgCanvas,
        primaryColor: AppColors.primary,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,
          secondary: AppColors.secondary,
          surface: AppColors.bgSurface,
        ),
        textTheme: GoogleFonts.interTextTheme(
          ThemeData.dark().textTheme,
        ),
      ),
      home: initialScreen,
    );
  }
}
