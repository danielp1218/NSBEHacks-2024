/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Emojis = "emojis",
	Info = "info",
	MergeCache = "merge_cache",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type EmojisRecord = {
	career?: string
	emoji?: string
}

export type InfoRecord = {
	career?: string
	info?: string
}

export type MergeCacheRecord = {
	career1?: string
	career2?: string
	result?: string
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type EmojisResponse<Texpand = unknown> = Required<EmojisRecord> & BaseSystemFields<Texpand>
export type InfoResponse<Texpand = unknown> = Required<InfoRecord> & BaseSystemFields<Texpand>
export type MergeCacheResponse<Texpand = unknown> = Required<MergeCacheRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	emojis: EmojisRecord
	info: InfoRecord
	merge_cache: MergeCacheRecord
	users: UsersRecord
}

export type CollectionResponses = {
	emojis: EmojisResponse
	info: InfoResponse
	merge_cache: MergeCacheResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'emojis'): RecordService<EmojisResponse>
	collection(idOrName: 'info'): RecordService<InfoResponse>
	collection(idOrName: 'merge_cache'): RecordService<MergeCacheResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
