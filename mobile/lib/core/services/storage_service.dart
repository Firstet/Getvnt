import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const String keyToken = 'getvnt_auth_token';
  static const String keyUser = 'getvnt_user_data';
  static const String keyTourCompleted = 'getvnt_tour_completed';
  static const String keyOfflineScans = 'getvnt_offline_scans_queue';

  // Save Auth Token
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(keyToken, token);
  }

  // Get Auth Token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(keyToken);
  }

  // Save User JSON
  static Future<void> saveUserData(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(keyUser, jsonEncode(userData));
  }

  // Get User JSON
  static Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(keyUser);
    if (raw == null) return null;
    return jsonDecode(raw);
  }

  // Clear Auth State on Logout
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(keyToken);
    await prefs.remove(keyUser);
  }

  // Onboarding Tour Completed
  static Future<bool> isTourCompleted() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(keyTourCompleted) ?? false;
  }

  static Future<void> setTourCompleted(bool completed) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(keyTourCompleted, completed);
  }

  // Queue Offline Ticket Scan
  static Future<void> queueOfflineScan(String ticketCode, String eventId) async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> current = prefs.getStringList(keyOfflineScans) ?? [];
    final scanItem = jsonEncode({
      'ticket_code': ticketCode,
      'event_id': eventId,
      'scanned_at': DateTime.now().toIso8601String(),
    });
    current.add(scanItem);
    await prefs.setStringList(keyOfflineScans, current);
  }

  // Get Pending Offline Scans
  static Future<List<Map<String, dynamic>>> getOfflineScans() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> current = prefs.getStringList(keyOfflineScans) ?? [];
    return current.map((s) => jsonDecode(s) as Map<String, dynamic>).toList();
  }

  // Clear Pending Offline Scans
  static Future<void> clearOfflineScans() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(keyOfflineScans);
  }
}
