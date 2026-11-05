export interface ConversationParticipantIds {
  homeownerId: string;
  contractorId: string;
}

export function isConversationParticipant(
  userId: string,
  participants: ConversationParticipantIds,
) {
  return (
    userId === participants.homeownerId || userId === participants.contractorId
  );
}

export function isConversationMessagePair(
  senderId: string,
  receiverId: string,
  participants: ConversationParticipantIds,
) {
  return (
    senderId !== receiverId &&
    isConversationParticipant(senderId, participants) &&
    isConversationParticipant(receiverId, participants)
  );
}

export function isLegacyThreadParticipant(
  userId: string,
  homeownerId: string,
  contractorIds: readonly string[],
) {
  return userId === homeownerId || contractorIds.includes(userId);
}

export function isLegacyMessagePair(
  senderId: string,
  receiverId: string,
  homeownerId: string,
  contractorIds: readonly string[],
) {
  return (
    senderId !== receiverId &&
    ((senderId === homeownerId && contractorIds.includes(receiverId)) ||
      (receiverId === homeownerId && contractorIds.includes(senderId)))
  );
}

export function legacyMessageVisibilityWhere(
  userId: string,
  homeownerId: string,
) {
  if (userId === homeownerId) return {};
  return {
    OR: [
      { fromUserId: userId, toUserId: homeownerId },
      { fromUserId: homeownerId, toUserId: userId },
    ],
  };
}
