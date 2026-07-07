package com.cloudsandbox.auth.mapper;

import com.cloudsandbox.auth.dto.response.UserResponse;
import com.cloudsandbox.auth.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
