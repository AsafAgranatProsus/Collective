/**
 * Unified Type Exports
 * 
 * Single source of truth for all data layer types.
 * Import types from this file for new code.
 * 
 * @see Cursor/PROTOTYPING_GUIDE.md for usage conventions
 */

// =============================================================================
// GROUP & MEMBER TYPES
// =============================================================================

/**
 * Group - A collection of people coordinating together
 * Use this for group metadata (name, members, display info)
 */
export type { Group } from './groups.svelte';

/**
 * Member - A person in a group
 * Use this for member info (name, avatar, role)
 */
export type { Member } from './household';

// =============================================================================
// SCENARIO & MESSAGE TYPES
// =============================================================================

/**
 * Message - A single message in a conversation
 * Can be from user, AI, or peer
 */
export type { Message } from './scenarios';

/**
 * Scenario - A scripted conversation flow
 * Contains array of messages with quick replies and cards
 */
export type { Scenario } from './scenarios';

/**
 * QuickReply - A button option for user responses
 */
export type { QuickReply } from './scenarios';

// =============================================================================
// ITEM TYPES (Chores, Expenses, Shopping)
// =============================================================================

/**
 * CoordinatedItem - Any item being tracked (chore, expense, shopping)
 */
export type { CoordinatedItem, ItemType, ItemStatus } from './items';

// =============================================================================
// CHAT TYPES
// =============================================================================

/**
 * GroupChatMessage - Peer-to-peer message in group chat
 */
export type { GroupChatMessage } from './groupChat';

// =============================================================================
// ANALYTICS TYPES
// =============================================================================

/**
 * WeekAnalytics - Weekly performance metrics
 */
export type { WeekAnalytics } from './analytics';

/**
 * MonthAnalytics - Monthly performance metrics with breakdown
 */
export type { MonthAnalytics } from './analytics';

/**
 * UserAnalytics - Combined week/month analytics for a user
 */
export type { UserAnalytics, AllUsersAnalytics } from './analytics';

/**
 * GroupWeekAnalytics - Group-level weekly metrics
 */
export type { GroupWeekAnalytics, GroupMonthAnalytics } from './analytics';

// =============================================================================
// CONFIG TYPES
// =============================================================================

/**
 * PrototypeMode - UX mode configuration
 */
export type { PrototypeMode, PrototypeModeId } from '../config/prototypeModes';

