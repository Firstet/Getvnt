class ApiEndpoints {
  // Use 10.0.2.2 for Android Emulator, or localhost / LAN IP
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  static const String login = '$baseUrl/auth/login';
  static const String me = '$baseUrl/auth/me';

  static const String brand = '$baseUrl/brand';

  static const String events = '$baseUrl/organizer/events';
  static const String createEvent = '$baseUrl/organizer/events';

  static const String orders = '$baseUrl/organizer/orders';

  static const String attendees = '$baseUrl/organizer/attendees';
  static const String checkInTicket = '$baseUrl/organizer/tickets/checkin';

  static const String aiAssistant = '$baseUrl/integrations/ai-assistance/generate';
}
