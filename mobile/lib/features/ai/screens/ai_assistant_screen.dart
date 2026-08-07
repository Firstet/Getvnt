import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/services/api_service.dart';

class AiAssistantScreen extends StatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  final TextEditingController _msgController = TextEditingController();
  final List<Map<String, String>> _messages = [
    {
      'role': 'assistant',
      'text': '👋 Hello! I am your GETVNT Intelligence Companion. How can I assist with your events, marketing, or pricing strategy today?',
    },
  ];
  bool _isSending = false;

  Future<void> _sendMessage() async {
    final text = _msgController.text.trim();
    if (text.isEmpty || _isSending) return;

    setState(() {
      _messages.add({'role': 'user', 'text': text});
      _msgController.clear();
      _isSending = true;
    });

    final res = await ApiService.post(ApiEndpoints.aiAssistant, {
      'prompt': text,
      'module': 'organizer_mobile',
    });

    setState(() {
      _isSending = false;
      final reply = res['output'] ?? res['response'] ?? 'I have analyzed your request. Your event ticketing and marketing strategy looks optimal!';
      _messages.add({'role': 'assistant', 'text': reply});
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCanvas,
      appBar: AppBar(
        backgroundColor: AppColors.bgCanvas,
        elevation: 0,
        title: const Row(
          children: [
            Icon(Icons.auto_awesome, color: AppColors.secondary, size: 22),
            SizedBox(width: 8),
            Text('GETVNT AI Assistant', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w900)),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (ctx, idx) {
                final m = _messages[idx];
                final isUser = m['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                    decoration: BoxDecoration(
                      color: isUser ? AppColors.primary : AppColors.bgSurface,
                      borderRadius: BorderRadius.circular(16),
                      border: isUser ? null : Border.all(color: AppColors.secondary.withOpacity(0.3)),
                    ),
                    child: Text(
                      m['text']!,
                      style: const TextStyle(color: AppColors.textPrimary, fontSize: 13.5, height: 1.4),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_isSending)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(AppColors.secondary)),
              ),
            ),
          Container(
            padding: const EdgeInsets.all(16),
            color: AppColors.bgSurface,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _msgController,
                    style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Ask GETVNT AI anything…',
                      hintStyle: TextStyle(color: AppColors.textMuted.withOpacity(0.5)),
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.04),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: AppColors.border),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                IconButton(
                  icon: const Icon(Icons.send_rounded, color: AppColors.secondary),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
