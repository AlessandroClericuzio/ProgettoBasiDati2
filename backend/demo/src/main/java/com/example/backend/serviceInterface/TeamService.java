package com.example.backend.serviceInterface;


import com.example.backend.model.Team;

import java.util.List;
import java.util.Optional;

public interface TeamService {
    Optional<Team> getTeamById(String id);
    Team saveTeam(Team team);
    List<Team> getAllTeams();
    void deleteTeam(String id);
    Optional<Team> getTeamByTeamApiId(int teamApiId);

}
