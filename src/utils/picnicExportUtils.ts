import { PicnicPlan } from '../types/picnic';

export function shareToWhatsApp(plan: PicnicPlan): void {
  const message = createWhatsAppMessage(plan);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  // Open WhatsApp in a new window/tab
  window.open(whatsappUrl, '_blank');
}

function createWhatsAppMessage(plan: PicnicPlan): string {
  const totalGuests = plan.groupSize.adults + plan.groupSize.kids;
  
  const message = `
🧺 *${plan.title}*

📅 *Date:* ${plan.date}
⏰ *Time:* ${plan.time}
📍 *Location:* ${plan.location}
👥 *Group:* ${totalGuests} people${plan.groupSize.pets > 0 ? ` + ${plan.groupSize.pets} pets` : ''}
⏱️ *Duration:* ${plan.duration} hours

📝 *Summary:*
${plan.summary}

✅ *Essential Items to Bring:*
${plan.packingList
  .filter(item => item.essential)
  .slice(0, 8)
  .map(item => `• ${item.name}${item.quantity ? ` (${item.quantity})` : ''}`)
  .join('\n')}

🍽️ *Food Ideas:*
${plan.foodSuggestions
  .slice(0, 5)
  .map(food => `• ${food.name} - ${food.servings}`)
  .join('\n')}

🎯 *Activities:*
${plan.activities
  .slice(0, 4)
  .map(activity => `• ${activity.name} (${activity.duration})`)
  .join('\n')}

💰 *Estimated Budget:* ${plan.budget.estimated}

🌤️ *Weather Tips:*
${plan.weatherTips
  .slice(0, 3)
  .map(tip => `• ${tip}`)
  .join('\n')}

Let's make this picnic amazing! 🌟

_Created with Picnic Planner_
  `.trim();
  
  return message;
}

export function exportPicnicPlan(plan: PicnicPlan): string {
  const planText = `
🧺 PICNIC PLAN - ${plan.title}

📅 Date: ${plan.date}
⏰ Time: ${plan.time}  
📍 Location: ${plan.location}
⏱️ Duration: ${plan.duration} hours
👥 Group Size: ${plan.groupSize.adults} adults, ${plan.groupSize.kids} kids${plan.groupSize.pets > 0 ? `, ${plan.groupSize.pets} pets` : ''}

📝 SUMMARY
${plan.summary}

✅ PACKING CHECKLIST
${plan.packingList.map(item => `${item.essential ? '🔸' : '◦'} ${item.name}${item.quantity ? ` (${item.quantity})` : ''}${item.notes ? ` - ${item.notes}` : ''}`).join('\n')}

🍽️ FOOD & DRINK IDEAS
${plan.foodSuggestions.map(food => `• ${food.name} - ${food.servings} (${food.difficulty}, ${food.prepTime})`).join('\n')}

🎯 ACTIVITIES
${plan.activities.map(activity => `• ${activity.name} - ${activity.duration} (${activity.participants})`).join('\n')}

📋 SCHEDULE
${plan.schedule.map(slot => `${slot.timeSlot} - ${slot.activity}: ${slot.description}`).join('\n')}

🌤️ WEATHER TIPS
${plan.weatherTips.map(tip => `• ${tip}`).join('\n')}

🛡️ SAFETY TIPS
${plan.safetyTips.map(tip => `• ${tip}`).join('\n')}

🔄 BACKUP PLANS
${plan.backupPlans.map(plan => `• ${plan}`).join('\n')}

💰 BUDGET BREAKDOWN
Estimated Total: ${plan.budget.estimated}
${plan.budget.breakdown.map(item => `• ${item.category}: ${item.amount}`).join('\n')}

Created with Picnic Planner on ${new Date(plan.createdAt).toLocaleDateString()}
  `.trim();
  
  return planText;
}

export function exportToCalendar(plan: PicnicPlan): void {
  const startDate = new Date(`${plan.date}T${plan.time}`);
  const endDate = new Date(startDate.getTime() + plan.duration * 60 * 60 * 1000);
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Picnic Planner//EN\n`;
  
  icsContent += `BEGIN:VEVENT\n`;
  icsContent += `UID:${plan.id}@picnicplanner.com\n`;
  icsContent += `DTSTART:${formatDate(startDate)}\n`;
  icsContent += `DTEND:${formatDate(endDate)}\n`;
  icsContent += `SUMMARY:${plan.title}\n`;
  icsContent += `DESCRIPTION:${plan.summary}\\n\\nLocation: ${plan.location}\\nDuration: ${plan.duration} hours\\nGroup: ${plan.groupSize.adults + plan.groupSize.kids} people\n`;
  icsContent += `LOCATION:${plan.location}\n`;
  icsContent += `END:VEVENT\n`;
  
  icsContent += `END:VCALENDAR`;
  
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `picnic-${plan.date}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}