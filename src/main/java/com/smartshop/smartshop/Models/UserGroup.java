package com.smartshop.smartshop.Models;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_groups")
@ToString(exclude = {"usuarios"})
@EqualsAndHashCode(exclude = {"usuarios"})
public class UserGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "groups")
    @Builder.Default
    private Set<Usuario> usuarios = new HashSet<>();
}
