import {ApiManager} from '../../../managers/ApiManager';
import {expect} from '@playwright/test';
import {User} from '../../types/user.type';
import {USER_RESPONSE_SCHEMA, UserResponse} from './user.schemas';
import {Step} from '../../../decorators/step.decorator';

export abstract class UserClient {
    @Step('Create new User')
    static async postCreateNewUser(
        user: User,
        apiManager: ApiManager,
        enableSteps: boolean = true,
    ): Promise<UserResponse>  {
        const result = await apiManager.postCreateRecord(
            '/api/resource/User',
            'User',
            user,
            enableSteps
        )
        const parsedResponse: UserResponse = USER_RESPONSE_SCHEMA.parse(result.response_body);

        expect(
            parsedResponse.data.name,
            '"name" should equal "email"'
        ).toBe(parsedResponse.data.email);
        expect(
            parsedResponse.data.first_name,
            `"first_name" should equal "${result.request_body.first_name}"`
        ).toBe(result.request_body.first_name);
        expect(
            parsedResponse.data.last_name,
            `"last_name" should equal "${result.request_body.last_name}"`
        ).toBe(result.request_body.last_name);
        expect(
            parsedResponse.data.role_profile_name,
            `"role_profile_name" should equal "${result.request_body.role_profile_name}"`
        ).toBe(result.request_body.role_profile_name);

        return parsedResponse;
    }

    static async isUserExists(
        user: User,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/User',
            user.email,
            enableSteps
        );
    }

}